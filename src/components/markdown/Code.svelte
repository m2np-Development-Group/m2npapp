<script>
  import Highlight from "svelte-highlight";

  import * as languages from "svelte-highlight/src/languages";

  const langMap = {
    "bash": languages.bash,
    "c": languages.c,
    "cpp": languages.cpp,
    "csharp": languages.csharp,
    "css": languages.css,
    "dockerfile": languages.dockerfile,
    "fsharp": languages.fsharp,
    "go": languages.go,
    "graphql": languages.graphql,
    "html": languages.html,
    "java": languages.java,
    "javascript": languages.javascript,
    "json": languages.json,
    "kotlin": languages.kotlin,
    "less": languages.less,
    "lua": languages.lua,
    "markdown": languages.markdown,
    "objectivec": languages.objectivec,
    "php": languages.php,
    "python": languages.python,
    "ruby": languages.ruby, 
    "rust": languages.rust,
    "scss": languages.scss,
    "sql": languages.sql,
    "swift": languages.swift,
    "typescript": languages.typescript,
    "yaml": languages.yaml
  }

  export let lang
  export let text
</script>
<Highlight language={(lang in langMap)?langMap[lang]:'plaintext'} code={text} />