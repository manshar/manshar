class Api::V1::TotalStatsController < ApplicationController
  respond_to :json

  after_action :verify_policy_scoped
  before_action :authenticate_user!

  # GET /api/v1/articles
  # GET /api/v1/articles.json
  # GET /api/v1/categories/1/articles
  # GET /api/v1/categories/1/articles.json
  # GET /api/v1/categories/1/topics/1/articles
  # GET /api/v1/categories/1/topics/1/articles.json
  def index
    # Use the custom Article.published method to return all articles that is
    # marked published.
    @total_stats = policy_scope(current_user.total_stats)
    render 'api/v1/total_stats/index'
  end

end