/**
 * PulseLogger - Utilitário para logging com graceful degradation
 * 
 * Funciona como singleton que tenta inicializar o Pulse para logs.
 * Se falhar, usa console.log como fallback.
 * 
 * @example
 * // Uso básico
 * getPulseLogger().then(logger => {
 *     logger.error('Erro crítico', 'contexto-opcional');
 * });
 * 
 * // Uso com fallback
 * let logger = null;
 * getPulseLogger().then(l => logger = l).catch(() => {});
 * if (logger) logger.critical('Erro grave');
 */
class PulseLogger {
    static instance = null;
    pulse = null;
    isMock = false;
    
    /**
     * Construtor privado - usa padrão Singleton
     */
    constructor() {
        if (PulseLogger.instance) return PulseLogger.instance;
        PulseLogger.instance = this;
    }
    
    /**
     * Inicializa o Pulse ou ativa modo mock se falhar
     * @returns {Promise<void>}
     */
    init() {
        return getUnifiedAppName()
            .then(appName => {
                this.pulse = new Pulse(`${appName}_${PULSE_APP}`, PULSE_GROUPID_PRODUCTION);
            })
            .catch(() => {
                this.isMock = true;
            });
    }
    
    /**
     * Retorna instância singleton do PulseLogger
     * @returns {Promise<PulseLogger>}
     */
    static getInstance() {
        if (!PulseLogger.instance) new PulseLogger();
        
        if (!PulseLogger.instance.pulse && !PulseLogger.instance.isMock) {
            return PulseLogger.instance.init().then(() => PulseLogger.instance);
        }
        
        return Promise.resolve(PulseLogger.instance);
    }
    
    /**
     * Método base para logging
     * @param {string} message - Mensagem do log
     * @param {string|null} context - Contexto opcional
     * @param {string} type - Tipo do log: info, warn, error, critical, debug
     */
    log(message, context = null, type = "info") {
        const finalContext = context || 'app';
        
        if (this.pulse) {
            this.pulse.send(message, finalContext, type);
        } else {
            const logMethodMap = {
                warn: console.warn,
                error: console.error,
                critical: console.error,
            };
            const logMethod = logMethodMap[type] || console.log;
            logMethod(`[PULSE-${type.toUpperCase()}]`, finalContext, message);
        }
    }
    
    /**
     * Log de informação
     * @param {string} message - Mensagem
     * @param {string|null} context - Contexto opcional
     */
    info(message, context = null) { this.log(message, context, "info"); }
    
    /**
     * Log de aviso
     * @param {string} message - Mensagem
     * @param {string|null} context - Contexto opcional
     */
    warn(message, context = null) { this.log(message, context, "warn"); }
    
    /**
     * Log de erro
     * @param {string} message - Mensagem
     * @param {string|null} context - Contexto opcional
     */
    error(message, context = null) { this.log(message, context, "error"); }
    
    /**
     * Log de erro crítico
     * @param {string} message - Mensagem
     * @param {string|null} context - Contexto opcional
     */
    critical(message, context = null) { this.log(message, context, "critical"); }
    
    /**
     * Log de debug
     * @param {string} message - Mensagem
     * @param {string|null} context - Contexto opcional
     */
    debug(message, context = null) { this.log(message, context, "debug"); }
}

/**
 * Função utilitária para obter instância do PulseLogger
 * @returns {Promise<PulseLogger>}
 * 
 * @example
 * // Uso recomendado para erros críticos apenas
 * getPulseLogger().then(logger => {
 *     logger.critical('Falha na autenticação');
 *     logger.error('Erro de validação');
 * }).catch(() => {
 *     // Logger falhou, continua sem logs
 * });
 */
function getPulseLogger() {
    return PulseLogger.getInstance();
}