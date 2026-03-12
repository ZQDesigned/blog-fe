import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const markdownPackages = [
  '/react-markdown/',
  '/remark-',
  '/rehype-',
  '/hast-',
  '/mdast-',
  '/micromark/',
  '/parse5/',
  '/property-information/',
  '/space-separated-tokens/',
  '/comma-separated-tokens/',
  '/unist-',
  '/vfile/',
  '/devlop/',
  '/hast-util-',
  '/mdast-util-',
  '/html-void-elements/',
  '/decode-named-character-reference/',
  '/character-entities',
];

const isMarkdownDependency = (id: string) => markdownPackages.some((pkg) => id.includes(pkg));

const antdOverlayPackages = [
  '/antd/es/modal/',
  '/antd/es/drawer/',
  '/antd/es/color-picker/',
  '/rc-dialog/',
  '/rc-drawer/',
  '/@rc-component/dialog/',
  '/@rc-component/drawer/',
  '/@rc-component/color-picker/',
];

const antdNavigationPackages = [
  '/antd/es/layout/',
  '/antd/es/menu/',
  '/antd/es/avatar/',
  '/antd/es/float-button/',
  '/rc-menu/',
  '/@rc-component/menu/',
  '/@rc-component/overflow/',
];

const antdFormPackages = [
  '/antd/es/select/',
  '/antd/es/pagination/',
  '/antd/es/radio/',
  '/antd/es/input/',
  '/antd/es/skeleton/',
  '/rc-select/',
  '/rc-pagination/',
  '/rc-field-form/',
  '/rc-picker/',
  '/@rc-component/select/',
  '/@rc-component/pagination/',
  '/@rc-component/input/',
  '/@rc-component/textarea/',
  '/@rc-component/form/',
  '/@rc-component/picker/',
];

const isMatchedPackage = (id: string, packages: string[]) => packages.some((pkg) => id.includes(pkg));

const getAntdIconChunkName = (id: string) => {
  const match =
    id.match(/\/@ant-design\/icons(?:-svg)?\/(?:es|lib)\/(?:icons|asn)\/([A-Za-z])/)
    ?? id.match(/\/@ant-design\/icons\/([A-Za-z])/);

  if (!match) {
    return null;
  }

  const initial = match[1].toUpperCase();

  if (initial <= 'F') {
    return 'antd-icons-a-f';
  }

  if (initial <= 'L') {
    return 'antd-icons-g-l';
  }

  if (initial <= 'R') {
    return 'antd-icons-m-r';
  }

  return 'antd-icons-s-z';
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          const antdIconChunkName = getAntdIconChunkName(id);
          if (antdIconChunkName) {
            return antdIconChunkName;
          }

          if (id.includes('/@ant-design/icons/') || id.includes('/@ant-design/icons-svg/')) {
            return 'antd-icons-core';
          }

          if (isMatchedPackage(id, antdOverlayPackages)) {
            return 'antd-overlay-vendor';
          }

          if (isMatchedPackage(id, antdNavigationPackages)) {
            return 'antd-navigation-vendor';
          }

          if (isMatchedPackage(id, antdFormPackages)) {
            return 'antd-form-vendor';
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (
            id.includes('/antd/') ||
            id.includes('/rc-') ||
            id.includes('/@rc-component/')
          ) {
            return 'antd-vendor';
          }

          if (id.includes('/@emotion/')) {
            return 'emotion-vendor';
          }

          if (id.includes('/framer-motion/')) {
            return 'motion-vendor';
          }

          if (isMarkdownDependency(id)) {
            return 'markdown-vendor';
          }

          if (id.includes('/three/')) {
            return 'three-vendor';
          }
        },
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
})
