# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :comment do
    guid "8ca87908-1f9e-4386-b64a-1834fbacb77d"
    body "Hello World"
    article
    user
  end
end
