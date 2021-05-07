## Node SDK

使用前请先确定已了解 Starling 产品的[相关功能](https://starling-public.bytedance.com)，已注册并加入到某个项目中，下文均以此为前提。

### 安装

```shell
npm install @volcengine/i18n-node
```

### 创建客户端

获取当前待拉取文案的所在项目名称、空间名称和项目的`appKey`，使用如下接口创建客户端：

```javascript
const Client = require('@volcengine/i18n-node');

const client = new Client("projectName", "namespace", "appKey");
```

项目名、空间名称、`appKey` 从 Starling 平台获取，请保证正确，`appKey` 用于身份鉴权，为安全考虑建议不要使用明文出现在代码中。

### 获取文案

提供两种方式获取已翻译的文案：获取给定项目、给定空间的整个文案包 或者 指定获取单个key的文案。

#### 获取单个文案

通过指定key和语言，以及可选的模式（如灰度发布的文案，功能暂未支持，可先忽略），对于语言可指定兜底语言或者指定版本。具体接口定义如下：

```javascript
const text = await client.getText("locale", "key");
```

#### 获取文案包

通过指定语言以及可选的模式（如灰度发布的文案，功能暂未支持，可先忽略）获取整个文案包，对于语言可指定兜底语言或者指定版本。文案包以 `key=value` 对的形式返回，具体接口定义如下：

```javascript
const result = await client.getPackage("locale");
```
