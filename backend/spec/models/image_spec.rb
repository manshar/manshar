require 'spec_helper'

describe Image do

	before (:each) do
		@image = FactoryGirl.create(:image)
	end

  it 'should have attached img' do
  	@image.should have_attached_file(:img)
  	@image.should validate_attachment_presence(:img)
	  @image.should validate_attachment_content_type(:img).
				allowing('image/png', 'image/gif').
				rejecting('text/plain', 'text/xml')
  end
end
