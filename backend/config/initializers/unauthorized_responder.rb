class UnauthorizedResponder < Devise::FailureApp
  def respond
    self.status = 401
    self.content_type = 'json'
    self.response_body = {"errors" => "Unauthorized."}.to_json
  end
end
