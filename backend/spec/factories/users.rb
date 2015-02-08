FactoryGirl.define do
  factory :user do
    trait :confirmed do
      confirmed_at Time.now
    end

    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:uid) { |n| "uid#{n}" }
    password 'testtest'
    password_confirmation 'testtest'

    # Uploading real data usually is pretty flacky and gives a lot of negative failures.
    # avatar { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
    avatar_uid '222'
    confirmed
  end

  factory :unconfirmed_user, class: User do
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:uid) { |n| "uid#{n}" }
    password 'testtest'
    password_confirmation 'testtest'
    avatar_uid '333'
    # Uploading real data usually is pretty flacky and gives a lot of negative failures.
    # avatar { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
  end
end
