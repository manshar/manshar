class LinkPolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)
    def resolve
      scope
    end
  end

  attr_reader :user, :link

  def initialize(user, link)
    @user = user
    @link = link
  end

  def index?
    super || true
  end

  def create?
    @user
  end

  def update?
    owned?
  end

  def destroy?
    owned?
  end

  private
  def owned?
    @link.user_id == @user.id if @user
  end

end
