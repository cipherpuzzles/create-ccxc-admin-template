using Ccxc.Core.HttpServer;
using Ccxc.Core.Plugins;
using Ccxc.Core.Plugins.DataModels;

namespace PluginBackend.Controllers;

public class BasicController : HttpController
{
    // 通过静态属性访问 IPluginAPI
    private IPluginAPI API => ExamplePlugin.API;

    // 注册一个POST请求，请注意所有请求注册的路径都不能相同。
    // 这个请求的方法签名始终为 public async Task ApiName(Request request, Response response)
    [HttpHandler("POST", "/admin/plguin/example-api")]
    public async Task ExampleApi(Request request, Response response)
    {
        // 对于任何一个请求，都可以通过先调用CheckAuth方法来确认调用者身份以及是否有权限
        var user = await API.CheckAuth(request, response, AuthLevel.Organizer);
        if (user == null) return; // 如果返回了null, 此时说明权限认证失败，相关内容在CheckAuth内部已经返回，此时只能直接return

        // 获取请求参数
        var requestJson = request.Json<ExampleRequest>();

        // 返回
        await response.JsonResponse(200, new
        {
            status = 1,
            test_req = requestJson,
            user_info = user
        });
    }
}

public class ExampleRequest
{
    public int type { get; set; }
    public string keyword { get; set; }
}
