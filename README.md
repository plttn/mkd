# Mkd

A CLI for managing your static site generator's blog posts.

## Quickstart

```
pnpm i -g mkd
```

Create a `mkd.json` file containing your front matter settings:

```
mkd init
```

Then create a new post: 

`mkd new`

When you're ready to undraft it: 

`mkd publish`

You're now ready to make whatever publishing process you use.

## Planned Features

- Edit the slug of the post rather than generating one
- More control over the draft setting (right now it's a forced boolean with `true` meaning it's a draft)


## Acknowledgments

- Thanks to [Steve Simkins](https://stevedylan.dev/) for [Sequoia](https://sequoia.pub)
    which was the inspiration for the config file and key mapping.
