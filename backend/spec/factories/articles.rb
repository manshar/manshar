FactoryGirl.define do
  factory :article do
  	user

    title "My Article Title"
    tagline "My Article Tagline"
    body "My Article Body"
    published false
  end
end
