class CategoryPolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)
    def resolve
      scope
    end
  end

  attr_reader :user, :category

  def initialize(user, category)
    @user = user
    @category = category
  end

  def create?
    admin?
  end

  def index?
    true
  end

  def show?
    true
  end

  def update?
    admin?
  end

  def destroy?
    admin?
  end

  private
  def admin?
    user.admin
  end

end
