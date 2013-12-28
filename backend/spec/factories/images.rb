include ActionDispatch::TestProcess

FactoryGirl.define do
  factory :image do
  	user

    title "My Image"
    caption "My Caption"
    asset { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
  end
end
