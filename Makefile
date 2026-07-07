NPM ?= npm
NPX ?= npx

.DEFAULT_GOAL := help

.PHONY: help install start start-clear tunnel share ios android web lint typecheck doctor deps-check check validate config export

help: ## Show available commands
	@echo "Financial Plan commands:"
	@echo "  make install       Install exact dependencies from package-lock.json"
	@echo "  make start         Start the Expo development server"
	@echo "  make start-clear   Start Expo and clear the Metro cache"
	@echo "  make tunnel        Start Expo through a tunnel for remote sharing"
	@echo "  make share         Alias for make tunnel"
	@echo "  make ios           Open the app in the iOS Simulator"
	@echo "  make android       Open the app in an Android emulator or device"
	@echo "  make web           Open the app in a web browser"
	@echo "  make lint          Run ESLint"
	@echo "  make typecheck     Run TypeScript without emitting files"
	@echo "  make doctor        Run Expo Doctor"
	@echo "  make deps-check    Check Expo dependency compatibility"
	@echo "  make check         Run lint, typecheck, and dependency checks"
	@echo "  make validate      Run all checks, including Expo Doctor"
	@echo "  make config        Print the resolved public Expo configuration"
	@echo "  make export        Export production bundles for all platforms"

install: ## Install exact locked dependencies
	$(NPM) ci

start: ## Start the Expo development server
	$(NPM) start

start-clear: ## Start Expo with an empty Metro cache
	$(NPX) expo start --clear

tunnel: ## Start Expo through a tunnel for remote sharing
	$(NPX) expo start --tunnel

share: tunnel ## Alias for tunnel

ios: ## Open the app in the iOS Simulator
	$(NPM) run ios

android: ## Open the app in an Android emulator or device
	$(NPM) run android

web: ## Open the app in a web browser
	$(NPM) run web

lint: ## Run ESLint
	$(NPM) run lint

typecheck: ## Run the TypeScript compiler without emitting files
	$(NPX) tsc --noEmit

doctor: ## Run Expo project diagnostics
	$(NPX) expo-doctor

deps-check: ## Check installed package versions against Expo SDK 54
	$(NPX) expo install --check

check: lint typecheck deps-check ## Run local code and dependency checks

validate: check doctor ## Run all project validation

config: ## Print the resolved public Expo configuration
	$(NPX) expo config --type public

export: ## Export production bundles for iOS, Android, and web
	$(NPX) expo export --platform all --clear
