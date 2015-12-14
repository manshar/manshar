class TotalStatPolicy < ApplicationPolicy
  class Scope < Struct.new(:user, :scope)

    def resolve
      scope.where(user_id: user.id)
    end

  end

  attr_reader :user, :total_stat

  def initialize(user, total_stat)
    @user = user
    @total_stat = total_stat
  end

  def create?
    super || true
  end

  def index?
    super || true
  end

  def show?
    super || owned?
  end

  def update?
    super || owned?
  end

  def destroy?
    super || owned?
  end


  private
  def owned?
		total_stat.user_id == user.id if user
  end

end
