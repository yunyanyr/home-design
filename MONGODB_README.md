# MongoDB Atlas 配置指南

本项目使用 MongoDB Atlas 作为数据库存储服务。以下是设置和使用的步骤。

## 配置步骤

1. 注册 MongoDB Atlas 账户：https://www.mongodb.com/cloud/atlas/register

2. 创建新的集群：
   - 选择免费的共享集群（M0）
   - 选择服务器提供商（AWS, Google Cloud, Azure）和区域（建议选择离你最近的区域）
   - 点击创建集群

3. 配置数据库访问：
   - 在左侧菜单选择 "Database Access"
   - 点击 "Add New Database User"
   - 用户名填写：`starifyfounders`（已在项目中配置）
   - 密码：创建一个安全的密码
   - 数据库用户权限：选择 "Atlas admin"
   - 点击 "Add User"

4. 配置网络访问：
   - 在左侧菜单选择 "Network Access"
   - 点击 "Add IP Address"
   - 开发时可以选择 "Allow Access from Anywhere"（在生产环境中应该限制为特定 IP）
   - 点击 "Confirm"

5. 获取连接字符串：
   - 等待集群创建完成（可能需要几分钟）
   - 点击 "Clusters" 在主页上
   - 点击 "Connect"
   - 选择 "Connect your application"
   - 选择 "Node.js" 和相应的版本
   - 复制提供的连接字符串

6. 更新 `.env` 文件：
   - 打开项目根目录下的 `.env` 文件
   - 将连接字符串粘贴到 `MONGODB_URI` 变量中
   - 替换 `<password>` 为你的数据库用户密码
   - 确保 `@your-cluster-url.mongodb.net` 部分被替换为实际的集群 URL

## 项目数据模型

本项目包含以下数据模型：

1. `Project` - 项目模型
   - 存储项目的基本信息
   - 通过虚拟关系链接到房间和家具

2. `Room` - 房间模型
   - 存储房间的位置、尺寸和类型
   - 链接到所属的项目

3. `Furniture` - 家具模型
   - 存储家具的位置、尺寸和类型
   - 链接到所属的房间和项目

## API 路由

项目中的 API 路由：

- `GET /api/projects` - 获取所有项目
- `POST /api/projects` - 创建新项目
- `GET /api/projects/[id]` - 获取特定项目及其房间和家具
- `PUT /api/projects/[id]` - 更新特定项目
- `DELETE /api/projects/[id]` - 删除特定项目（包括关联的房间和家具）

## 在代码中使用数据库连接

在 API 路由或服务器组件中使用 MongoDB 连接：

```javascript
import dbConnect from '@/lib/mongoose';
import Project from '@/models/Project';

// 连接到数据库
await dbConnect();

// 使用模型进行操作
const projects = await Project.find({});
```

在客户端组件中获取数据可以通过调用 API 路由：

```javascript
const fetchProjects = async () => {
  const response = await fetch('/api/projects');
  const data = await response.json();
  return data.data;
};
```

## 注意事项

- 确保 `.env` 文件中的 MongoDB 连接字符串不要提交到版本控制系统中
- 在生产环境中应当使用更严格的安全设置
- 对于大规模应用，考虑优化索引和查询性能 