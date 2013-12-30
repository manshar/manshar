# encoding: utf-8

# Seed your local database by running rake db:seed.

user = User.create(
  name: 'فراولة عبعال',
  bio: 'وحش في كتابة الأغاني العربية النشهورة.',
  email: 'aabaal@farawleh.com',
  password: 'farawleh',
  confirmed_at: Time.now)

user.articles.create([
  {
    title: 'بتحدى العالم',
    tagline: 'من أجمل ما غنى صابر الرباعي',
    body: 'بتحدى العالم كلو وأنا وياك، وبقول للدنيا إن أنا بهواك، وإن إنت حبيبي وروحي وقلبي معاك.',
    published: true
  }, {
    title: 'بتحدى العالم',
    tagline: 'من أجمل ما غنى صابر الرباعي',
    body: 'بتحدى العالم كلو وأنا وياك، وبقول للدنيا إن أنا بهواك، وإن إنت حبيبي وروحي وقلبي معاك.',
    published: true
  }, {
    title: 'بتحدى العالم',
    tagline: 'من أجمل ما غنى صابر الرباعي',
    body: 'بتحدى العالم كلو وأنا وياك، وبقول للدنيا إن أنا بهواك، وإن إنت حبيبي وروحي وقلبي معاك.',
    published: true
  }
])
