## new-tools
A Node Command Line Tool to auto generate a web structure.

and also a tutorial to learn how to make a Node Command.learn from http://www.awesomes.cn/source/12

## Change place
```generateStructure.js
 Use regular expression  to get the structure file path  prompts an error and solve the problem by changing the path.

  Options:

	var arr = __dirname;
	var rot = arr.split('\\');
	rot.splice(rot.length-1,1);
	var dir = rot.join('\/');
	console.log(dir);

```

## Install
```bash
npm install new-tools -g
```


## Usage
```bash
copdel <project name>
```

Then
```bash
cd <project name>
npm install
gulp watch
```

Now you can develop your app...

## Options
```bash
 Usage: copdel [options] [project name]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -W, --without <str | array>  generate project without some models(value can be `sass`、`coffee`、`jade`)

```

You can use `-W` to  without some models,like `sass`、`coffee` or `jade`:
```bash
copdel demo --without sass,jade
```

