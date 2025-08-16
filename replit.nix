{ pkgs }:
{
  deps = [
    pkgs.nodejs-20_x
    pkgs.watchman
    pkgs.bashInteractive
    pkgs.git
  ];
}
