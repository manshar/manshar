Mobvious.configure do |config|
  config.strategies = [
    Mobvious::Strategies::Cookie.new([:mobile, :tablet, :desktop]),
    Mobvious::Strategies::MobileESP.new(:mobile_tablet_desktop)
  ]
end
