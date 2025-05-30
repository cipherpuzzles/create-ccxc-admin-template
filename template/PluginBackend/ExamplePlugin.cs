using Ccxc.Core.HttpServer;
using Ccxc.Core.Plugins;

namespace PluginBackend;

public class ExamplePlugin : IPlugin
{
    // 返回插件名称，注意名称必须唯一。为了防止重复，建议使用反写域名的方式命名。
    public string Name => "yt.ikp.ccxc-engine.ExamplePlugin";

    public static IPluginAPI API { get; private set; }
    public static IConfig Config { get; private set; }

    // 插件构造函数，CCXC引擎会自动注入IPluginAPI和IConfig实例。
    public ExamplePlugin(IPluginAPI api, IConfig config)
    {
        API = api;
        Config = config;
    }

    // 初始化插件
    public Task Initialize()
    {
        // 这个插件没有什么需要初始化的
        return Task.CompletedTask;
    }

    public Task<IEnumerable<HttpController>> RegisterControllers()
    {
        // 在这里初始化所有的HttpController，然后返回它们。
        var controllers = new List<HttpController>
        {
            new Controllers.BasicController(),
        };
        return Task.FromResult<IEnumerable<HttpController>>(controllers);
    }
}
