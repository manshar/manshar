# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :topic do
    title "MyString"
    articles_count 1
    category_id 1
  end
end
