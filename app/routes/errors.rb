module Errors
  class InternalServerError < StandardError; end
  class InvalidParameters < StandardError; end
  class NotFound < StandardError; end
end
