import restart from 'vite-plugin-restart'

export default {
    root: 'src/', // Sources files (typically where index.html is)
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: './', // Base URL when the app is running in a subdirectory
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true, // Add sourcemap
        assetsInlineLimit: 0, // Ensure all assets are written to files, not inlined
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    // Ensure assets (like textures) are placed correctly
                    if (/textures/.test(assetInfo.name)) {
                        return 'textures/[name][extname]';
                    }
                    return 'assets/[name][extname]';
                },
            },
        },
    },
    plugins:
    [
        restart({ restart: [ '../static/**', ] }) // Restart server on static file change
    ],
}