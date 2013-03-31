require 'test/unit'
require 'rack/test'
require 'mocha/setup'

begin
  require_relative '../app'
rescue NameError
  require File.expand_path('../app', __FILE__)
end

set :environment, :test
