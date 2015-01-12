class RecommendationPolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)
    def resolve
      scope.published
    end
  end

  attr_reader :user, :recommendation

  def initialize(user, recommendation)
    @user = user
    @recommendation = recommendation
  end

  def create?
    super || true
  end

  def index?
    super || true
  end

  def show?
    false
  end

  def update?
    false
  end

  def destroy?
    super || owned?
  end


  private
  def owned?
    recommendation.user_id == user.id if user
  end

end
