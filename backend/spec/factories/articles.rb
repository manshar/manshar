FactoryGirl.define do
  factory :article do
  	user

    title "My Article Title"
    tagline "My Article Tagline"
    body "My Article Body"
    published false
    cover_uid  '123'

    # Uploading real data usually is pretty flacky and gives a lot of negative failures.
    # cover { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
  end
end
