# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :recommendation do
    article
    user
  end
end
