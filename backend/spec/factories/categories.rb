FactoryGirl.define do
  factory :category, :class => 'Category' do
    title "MyString"
    description "MyDescription"
    image_uid "MyString"
    icon_uid "MyString"
    topics_count 1
    articles_count 1
  end
end
