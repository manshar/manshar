# encoding: utf-8

require 'spec_helper'

describe 'home page' do
  context 'when on page' do
    it 'has Manshar in Arabic', js: true do
      visit root_path
      expect(page).to have_content 'منشر'
    end
  end

  context 'when not logged in' do
    it 'has not logout link', js: true do
      visit root_path
      expect(page).to_not have_content 'خروج'
    end
  end
end
