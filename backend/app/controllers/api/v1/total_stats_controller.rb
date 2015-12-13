class Api::V1::TotalStatsController < ApplicationController
  respond_to :json

  after_action :verify_policy_scoped
  before_action :authenticate_user!

  # GET /api/v1/me/total_stats
  # GET /api/v1/me/total_stats.json
  def index
    @total_stats = policy_scope(current_user.total_stats)
    render 'api/v1/total_stats/index'
  end
end
