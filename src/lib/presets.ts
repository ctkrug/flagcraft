export interface Preset {
  id: string;
  label: string;
  helpText: string;
}

const GIT_HELP = `usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           <command> [<args>]

These are common Git commands used in various situations:

start a working area
   clone      Clone a repository into a new directory
   init       Create an empty Git repository

Global Options
  -v, --version         Show the version
  -h, --help            Show help for a command
  -C <path>             Run as if git was started in <path>

git branch options:
  -d, --delete          Delete a branch
  -f, --force           Reset branch to start point, even if it exists
  -a, --all             List both remote-tracking and local branches

git checkout options:
  -f, --conflict        Force checkout, discarding local changes
  -b <branch>           Create a new branch

Exit codes:
  0    Success
  1    Any kind of failure
`;

const DOCKER_HELP = `Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
      --config string   Location of client config files
  -c, --context string  Name of the context to use
  -D, --debug           Enable debug mode
  -H, --host list       Daemon socket to connect to
  -v, --version         Print version information and quit

docker build options:
  -f, --file string     Name of the Dockerfile
  -t, --tag list        Name and optionally a tag

docker rm options:
  -f, --force           Force the removal of a running container
  -v, --volumes          Remove anonymous volumes

Exit codes:
  0    Success
`;

const KUBECTL_HELP = `kubectl controls the Kubernetes cluster manager.

Basic Commands:
  create        Create a resource
  get           Display resources

kubectl get flags:
  -o, --output string      Output format
  -w, --watch              Watch for changes
  -f, --filename strings   Filename to use

kubectl delete flags:
  -f, --force              Force delete resources immediately

Global Flags:
      --kubeconfig string   Path to kubeconfig file
  -v, --v Level             Number for log level verbosity

Exit codes:
  0    Success
  1    Error
`;

export const presets: Preset[] = [
  { id: "git", label: "git", helpText: GIT_HELP },
  { id: "docker", label: "docker", helpText: DOCKER_HELP },
  { id: "kubectl", label: "kubectl", helpText: KUBECTL_HELP },
];
