class WarmConfigurationCacheJob < WarmCacheJob
  queue_as :default

  def perform(api_user, api_key)
    SoftlayerConnection.new(api_user, api_key)
    vm = VirtualMachine.new
    vm.send(:configuration)
  end
end
