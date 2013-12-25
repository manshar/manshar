class ArticlePolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)
    def resolve
      scope
    end
  end

  attr_reader :user, :article

  def initialize(user, article)
    @user = user
    @article = article
  end

  def create?
    true
  end

  def index?
    true
  end

  def show?
    @article.published || owned?
  end

  def update?
    owned?
  end

  def destroy?
    owned?
  end


  private
  def owned?
		@article.user_id == @user.id if @user
  end

end
