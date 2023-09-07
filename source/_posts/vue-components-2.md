---
title: 从零搭建你的个人Vue3组件库（二）：第一个组件
tags:
	- 组件库
cover: bg.png
top_img: bg.png
date: 2023-03-10 11:05:16
---

本篇文章将介绍如何在组件库中开发一个组件

# 测试组件
在 `packages/components/basic/button/button.vue` 文件中写一个简单的按钮

此时我们需要给 `button.vue` 一个 `name: sl-button` 好在全局挂载的时候作为组件名使用

```html
<template>
  <button>按钮</button>
</template>

<script lang="ts">
export default {
  name: "sl-button"
}
</script>
```

然后在 `packages/components/basic/button/index.ts` 将其导出
```ts
import Button from "./button.vue";
export { Button };
export default Button;
```

然后再`app.vue`中引用`Button`
```html
<script setup lang="ts">
import Button from '../packages/components/basic/button/index'
</script>

<template>
	<Button></Button>
</template>
```

启动项目便可以看到 `Button` 组件了,并且修改 `Button` 组件也会有热更新的效果

# 全局挂载组件

有的时候我们使用组件的时候想要直直接使用 `app.use()` 挂载整个组件库，其实使用 `app.use()` 的时候它会调用传入参数的 `install` 方法，因此首先我们给每个组件添加一个 `install` 方法，然后再导出整个组件库。我们在 `utils` 中添加一个 `withInstall.ts` 文件
```ts
import type { App, Plugin } from 'vue';
export type SFCWithInstall<T> = T & Plugin;
const withInstall = <T>(comp: T) => {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    // 当组件是 script setup 的形式时，会自动以为文件名注册，会挂载到组件的__name 属性上
    // 所以要加上这个条件
    const name = (comp as any).name || (comp as any).__name;
    //注册组件
    app.component(name, comp as SFCWithInstall<T>);
  };
  return comp as SFCWithInstall<T>;
};
export default withInstall
```

接下来在 `button/index.ts` 中：

```ts
import _Button from './button.vue'
import withInstall from '../../utils/withinstall';
export const Button = withInstall(_Button);

export default Button
```

在 `packages/components/index.ts` 中，我们整体抛出所有组件：
```ts
import type { App } from 'vue'
import slButton from './components/basic/button'

const components = [ slButton ]
const install = (app: App): void => {
  components.forEach(component => app.component(component.name, component))
}
const SlunceUI = { install }

export { slButton }
export default SlunceUI
```

这时候在 `src/main.ts` 中全局挂载组件库
```ts
import { createApp } from 'vue'
import App from './App.vue'

import SlunceUI from '../packages/components/index'

createApp(App).use(SlunceUI).mount('#app')
```

在 `App.vue` 中使用 `sl-button` 组件,然后就会发现组件库挂载成功了
```html
<script setup lang="ts">
</script>

<template>
  <sl-button></sl-button>
</template>
```

# 属性提示
但是这个全局组件并没有任何属性提示,所以我们要借助vscode中的volar给全局组件加上提示效果

首先安装 `@vue/runtime-core`
```
npm install @vue/runtime-core -D
```

在 `src` 下新建 `components.d.ts`
```ts
import * as components from "./index";
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    slButton: typeof components.Button;
    slIcon: typeof components.Icon;
  }
}
export {};
```

此时全局引入的组件也有了提示效果

> 当用户使用组件库的时候需要让用户在 `tsconfig.json` 中配置 `types:["easyest/lib/src/components"]` 才会出现提示效果

# 组件开发

我们都知道一个组件需要接受一些参数来实现不同效果,比如 `Button` 组件就需要接收 `type`、`size`、`round` 等属性,这里我们暂且只接收一个属性 `type` 来开发一个简单的 `Button` 组件。

我们可以根据传入的不同 `type` 来赋予 `Button` 组件不同类名
```html
// button.vue
<template>
  <button class="sl-button" :class="btnClass">
		<slot />
	</button>
</template>
<script lang='ts'>
export default {
	name: 'sl-button'
}
</script>
<script lang="ts" setup>
import "style.less";
import { computed } from "vue";
const props = defineProps({
  type: {
    type: String,
    default: "default",
  },
})
const btnClass = computed(() => {
	return [
		props.type ? `sl-button-${props.type}` : "",
	]
})
</script>
```

这里引入了样式文件,在 `button` 目录下新建 `style.less` 来存放 `Button` 组件的样式
```css
.sl-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.sl-button.sl-button-primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;

  &:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
}
```

> 这里使用了 `less`，需要通过 `npm i less-loader less --save-dev` 去安装

此时在 `App.vue` 中引入 `slButton` 组件就可以看到想要的效果了，由于已经全局引入了，可以直接使用
```html
<template>
  <sl-button type="primary">按钮</sl-button>
</template>
<script setup lang="ts">
</script>
```

这样我们就实现了一个最简单的组件，下一章我们将介绍如何给你的组件搭建一个好看的组件库文档

# 系列文章

+ {% post_link vue-components-0 '从零搭建你的个人Vue3组件库（零）：片头曲' %}
+ {% post_link vue-components-1 '从零搭建你的个人Vue3组件库（一）：项目搭建' %}
+ {% post_link vue-components-2 '从零搭建你的个人Vue3组件库（二）：第一个组件' %}
+ {% post_link vue-components-3 '从零搭建你的个人Vue3组件库（三）：搭建项目文档' %}
+ {% post_link vue-components-4 '从零搭建你的个人Vue3组件库（四）：第二个组件 Icon' %}