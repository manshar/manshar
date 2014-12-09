object @comment

attributes :id, :guid, :body, :created_at, :updated_at

child :user do
  extends 'api/v1/users/show'
end
