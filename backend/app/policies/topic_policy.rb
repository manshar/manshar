class TopicPolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)
    def resolve
      scope
    end
  end

  attr_reader :user, :topic

  def initialize(user, topic)
    @user = user
    @topic = topic
  end

  def create?
    true
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
    user.admin? || user.editor?
  end

end
