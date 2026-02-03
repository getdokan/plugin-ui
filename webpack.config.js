const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
    ...defaultConfig,
    entry: {
        index: './src/index.ts',
    },
    output: {
        ...defaultConfig.output,
        path: path.resolve( __dirname, 'dist' ),
        filename: '[name].js',
        library: {
            type: 'commonjs2',
        },
        clean: true,
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom',
        '@wordpress/element': '@wordpress/element',
        '@wordpress/components': '@wordpress/components',
        '@wordpress/block-editor': '@wordpress/block-editor',
        '@wordpress/hooks': '@wordpress/hooks',
        '@wordpress/i18n': '@wordpress/i18n',
        quill: 'quill',
    },
    module: {
        ...defaultConfig.module,
        rules: [
            // Filter out default CSS rules and add our own
            ...defaultConfig.module.rules.filter(
                ( rule ) =>
                    ! rule.test ||
                    ( rule.test && ! rule.test.toString().includes( 'css' ) )
            ),
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(
                                    __dirname,
                                    'postcss.config.js'
                                ),
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) =>
                plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new MiniCssExtractPlugin( {
            filename: 'styles.css',
        } ),
    ],
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            '@': path.resolve( __dirname, 'src' ),
        },
        extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ],
        modules: [
            path.resolve( __dirname, 'node_modules' ),
            path.resolve( __dirname, '../../node_modules' ),
            'node_modules',
        ],
    },
};
