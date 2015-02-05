# encoding: utf-8

# Seed your local database by running rake db:seed.

user = User.create(
  name: 'فراولة عبعال',
  bio: 'وحش في كتابة الأغاني العربية النشهورة.',
  email: 'aabaal@farawleh.com',
  password: 'farawleh',
  uid: 'عبعال',
  avatar: fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png'),
  confirmed_at: Time.now)

user.articles.create([
  {
    title: 'بتحدى العالم',
    tagline: 'من أجمل ما غنى صابر الرباعي',
    body: 'بتحدى العالم كلو وأنا وياك، وبقول للدنيا إن أنا بهواك، وإن إنت حبيبي وروحي وقلبي معاك.',
    cover: fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png'),
    published: true
  }, {
    title: 'بتحدى العالم',
    tagline: 'من أجمل ما غنى صابر الرباعي',
    body: 'بتحدى العالم كلو وأنا وياك، وبقول للدنيا إن أنا بهواك، وإن إنت حبيبي وروحي وقلبي معاك.',
    cover: fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png'),
    published: true
  }, {
    title: 'بتحدى العالم',
    tagline: 'من أجمل ما غنى صابر الرباعي',
    body: 'بتحدى العالم كلو وأنا وياك، وبقول للدنيا إن أنا بهواك، وإن إنت حبيبي وروحي وقلبي معاك.',
    cover: fixture_file_upload(Rails.root.join('spec', 'fixtures', 'images', 'test.png'), 'image/png'),
    published: true
  }
])


user.links.create([
  {
    title: 'Facebook',
    url: 'http://www.facebook.com'
  }, {
    title: 'Twitter',
    url: 'http://www.twitter.com'
  }
])
