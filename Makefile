.PHONY: start dev preview test build release-check

start: dev

dev:
	npm run dev

preview:
	npm run preview

test:
	npm test

build:
	npm run build

release-check:
	npm run release:check
