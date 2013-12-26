class ImagePolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)
    def resolve
      scope
    end
  end

  attr_reader :user, :image

  def initialize(user, image)
    @user = user
    @image = image
  end

  def create?
    @user
  end

  def show?
    true
  end

  def update?
    owned?
  end

  def destroy?
    owned?
  end


  private
  def owned?
		@image.user_id == @user.id if @user
  end

end
