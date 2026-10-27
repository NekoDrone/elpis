{
  mkShellNoCC,
  lib,
  stdenv,

  # extra tooling
  eslint_d,
  prettierd,
  nodejs_24,
  pnpm,
  typescript,
  typescript-language-server,
  prettier,

  glibc,
  patchelf,

  callPackage,
}:
let
  defaultPackage = callPackage ./default.nix { };

  # `wrangler dev` (and therefore the prerender step of `pnpm build`) shells out
  # to a prebuilt workerd binary, which expects a generic-linux dynamic linker
  # that NixOS does not have. Point it at ours. Re-run after every pnpm install.
  #
  # Only relevant on Linux: the darwin build of workerd is a Mach-O binary with
  # no interpreter to patch, and `glibc` does not evaluate on darwin at all.
  patchWorkerdHook = ''
    for wd in node_modules/.pnpm/@cloudflare+workerd-linux-64@*/node_modules/@cloudflare/workerd-linux-64/bin/workerd; do
      if [ -f "$wd" ] && ! "$wd" --version >/dev/null 2>&1; then
        chmod u+w "$wd"
        patchelf --set-interpreter ${glibc}/lib64/ld-linux-x86-64.so.2 "$wd"
        echo "patched workerd for NixOS: $wd"
      fi
    done
  '';
in
mkShellNoCC {
  inputsFrom = [ defaultPackage ];

  packages = [
    eslint_d
    prettierd
    nodejs_24
    pnpm
    typescript
    typescript-language-server
    prettier
  ]
  ++ lib.optional stdenv.hostPlatform.isLinux patchelf;

  shellHook = ''
    eslint_d start # start eslint daemon
    eslint_d status # inform user about eslint daemon status
  ''
  + lib.optionalString stdenv.hostPlatform.isLinux patchWorkerdHook;
}
