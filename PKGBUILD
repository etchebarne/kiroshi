# Maintainer: Martin Etchebarne <martin@etchebarne.net>
pkgname=kiroshi
pkgver=0.1.0
pkgrel=1
pkgdesc="A TSD rally racing software."
arch=('x86_64')
url="https://github.com/martinetbn/kiroshi"
license=('MIT')
depends=('webkit2gtk-4.1' 'gtk3' 'cairo' 'glib2' 'libsoup3' 'sqlite')
makedepends=('rust' 'cargo' 'nodejs' 'bun' 'pkgconf' 'git')
source=("git+https://github.com/martinetbn/kiroshi.git")
sha256sums=('SKIP')

build() {
    cd "$srcdir/$pkgname"
    bun install
    bun tauri build --bundles none
}

package() {
    cd "$srcdir/$pkgname"

    # Install binary
    install -Dm755 "src-tauri/target/release/$pkgname" "$pkgdir/usr/bin/$pkgname"

    # Install desktop file
    install -Dm644 /dev/stdin "$pkgdir/usr/share/applications/$pkgname.desktop" <<EOF
[Desktop Entry]
Name=Kiroshi
Comment=A TSD rally racing software.
Exec=kiroshi
Icon=kiroshi
Terminal=false
Type=Application
Categories=Utility;
EOF

    # Install icon if exists
    if [ -f "src-tauri/icons/icon.png" ]; then
        install -Dm644 "src-tauri/icons/icon.png" "$pkgdir/usr/share/icons/hicolor/256x256/apps/$pkgname.png"
    fi
}
