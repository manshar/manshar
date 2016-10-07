class ArticlePolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)

    def resolve
      if user
        scope.where(user_id: user.id)
      else
        scope.where(published: true)
      end
    end

  end

  attr_reader :user, :article

  def initialize(user, article)
    @user = user
    @article = article
  end

  def create?
    super || true
  end

  def index?
    super || true
  end

  def show?
    super || article.published || owned?
  end

  def drafts?
    super || true
  end

  def update?
    super || owned?
  end

  def destroy?
    super || owned?
  end


  private
  def owned?
    article.user_id == user.id if user
  end

end
