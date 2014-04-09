object @recommendation

attributes :id, :created_at, :updated_at

child :user do
  extends 'api/v1/users/show'
end

child :article do
  extends 'api/v1/articles/show'
end
