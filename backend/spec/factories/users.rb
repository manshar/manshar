FactoryGirl.define do
  factory :user do
    trait :confirmed do
      confirmed_at Time.now
    end

    sequence(:email) { |n| "user#{n}@example.com" }
    password 'testtest'
    password_confirmation 'testtest'
    avatar { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
    confirmed
  end

  factory :unconfirmed_user, class: User do
    sequence(:email) { |n| "user#{n}@example.com" }
    password 'testtest'
    password_confirmation 'testtest'
    avatar { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png') }
  end
end
