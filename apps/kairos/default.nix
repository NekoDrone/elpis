{ lib, buildNpmPackage }:

buildNpmPackage {
  pname = "elpis-kairos";
  version = "0.0.1";

  src = ./.;

  npmDepsHash = lib.fakeHash;

  meta = {
    description = "FFXIV leveling calculator";
    homepage = "https://github.com/NekoDrone/elpis";
    license = lib.licenses.mit;
    maintainers = with lib.maintainers; [ ];
    mainProgram = "example";
  };
}
