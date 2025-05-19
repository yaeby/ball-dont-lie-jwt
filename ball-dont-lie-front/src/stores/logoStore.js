const logoModules = import.meta.glob('../assets/*.svg', { eager: true });

export const useLogoStore = () => {
    /**
     * @param {string} abbreviation 
     * @returns {string}
     */
    const getTeamLogo = (abbreviation) => {
        try {
            const path = `../assets/${abbreviation}.svg`;
            return logoModules[path].default;
        } catch (error) {
            console.error(`Error getting logo for ${abbreviation}:`, error);
        }
    };

    /**
     * @param {string} abbreviation 
     * @returns {boolean} 
     */
    const hasLogo = (abbreviation) => {
        const path = `../assets/${abbreviation}.svg`;
        return !!logoModules[path];
    };

    /**
     * @returns {Object} 
     */
    const getAllLogos = () => {
        const logos = {};
        
        Object.keys(logoModules).forEach(path => {
            const match = path.match(/\/([A-Z]{3})\.svg$/);
            if (match && match[1]) {
                const abbreviation = match[1];
                logos[abbreviation] = logoModules[path].default;
            }
        });
        
        return logos;
    };

    return {
        getTeamLogo,
        hasLogo,
        getAllLogos
    };
};
