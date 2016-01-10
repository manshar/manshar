class Api::V1::UsersController < ApplicationController
  respond_to :json
  before_action :authenticate_user!, except: [:index, :show]

  # GET /api/v1/users
  # GET /api/v1/users.json
  def index

    # Retreive users around a specific user id.
    # TODO(mkhatib): This is really ugly and hacky.
    # Move this to the user model and come up with a better way to paginate.
    if params[:pivot_id]
      user = User.find(params[:pivot_id])

      before_order_dir = order_dir == 'DESC' ? 'ASC' : 'DESC'
      # This is to make sure records with similar values get paginated
      # correctly by making sure they're always ordered by a consistent
      # second unique value (e.g. id) - only needed if we're not already
      # sorting by id.
      if order_param != 'id'
        after = User.where(
          order_param + ' > ? OR ' + order_param + ' = ? AND id > ?',
            user.try(order_param), user.try(order_param), user.id)
            .where.not(id: user).where.not(published_articles_count: 0)
            .order(order_param + ' ' + order_dir + ', id ASC')
            .limit(params[:after_pivot_count])

        before = User.where(
          order_param + ' < ? OR ' + order_param + ' = ? AND id < ?',
            user.try(order_param), user.try(order_param), user.id)
            .where.not(id: user).where.not(published_articles_count: 0)
            .order(order_param + ' ' + before_order_dir + ', id DESC')
            .limit(params[:before_pivot_count])
      else
        after = User.where(order_param + ' >= ?', user.try(order_param))
            .where.not(id: user, published_articles_count: 0)
            .order(order_param + ' ' + order_dir)
            .limit(params[:after_pivot_count])

        before = User.where(order_param + ' < ?', user.try(order_param))
            .where.not(id: user, published_articles_count: 0)
            .order(order_param + ' ' + before_order_dir)
            .limit(params[:before_pivot_count])
      end

      if params[:include_pivot]
        if before_order_dir == 'DESC'
          before = before.sort {|a, b| a.try(order_param) <=> b.try(order_param)}
        else
          before = before.sort {|a, b| b.try(order_param) <=> a.try(order_param)}
        end
        # If the request is for before and after, put the user in the middle.
        @users = before + [user] + after
      else
        @users = before + after
      end
      @users = @users.uniq {|p| p.id }
    else
      @users = User.top.publishers.page(params[:page]).per(params[:per])
    end

    render 'api/v1/users/index'
  end

  # GET /api/v1/users/1
  # GET /api/v1/users/1.json
  def show
    @user = User.find(params[:id])
    render 'api/v1/users/show'
  end

  # PATCH/PUT /api/v1/users
  # PATCH/PUT /api/v1/users.json
  def update
    @user = current_user
    if @user.update(update_user_params)
      render 'api/v1/users/show'
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end


  private

  def update_user_params
    params.require(:user).permit(:name, :bio, :avatar)
  end

  def order_dir
    permitted_dir = ['DESC', 'ASC']
    if permitted_dir.include?(params[:order_dir])
      params[:order_dir]
    else
      'ASC'
    end
  end

  def order_param
    # It is important not to allow other values for order otherwise
    # users can run malicious method on all users :-).
    permitted_orders = ['name', 'id', 'published_articles_count', 'created_at']
    if permitted_orders.include?(params[:order])
      params[:order]
    else
      'published_articles_count'
    end
  end

end
