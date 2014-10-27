include ActionDispatch::TestProcess

FactoryGirl.define do
  factory :image do
  	user

    title "My Image"
    caption "My Caption"

    # Uploading real data usually is pretty flacky and gives a lot of negative failures.
    # asset { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
    asset_uid '99'
  end
end
