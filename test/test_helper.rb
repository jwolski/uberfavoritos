require 'test/unit'
require 'rack/test'

begin
  require_relative '../app'
rescue NameError
  require File.expand_path('../app', __FILE__)
end

set :environment, :test
