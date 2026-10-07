import { ActivityIndicator } from "react-native";
import { Button, TextButton } from "./styles";
import { IButtonViewProps } from "./types";
import theme from "~/client/styles/theme";

import { useButtonView } from "./useButtonView";

export const ButtonView = ({
    children,
    colorButton,
    sizeButton,
    iconButton,
    alignIcon = "left",
    borderRadius = 5,
    backgroundColor = theme.colors.primary,
    textColor = theme.colors.primaryText,
    isLoading,
    disabled,
    transparent,
    fullWidth,
    widthButton,
    ...props
}: IButtonViewProps) => {
    const { switchSizeButton } = useButtonView();
    const { fontSize, padding } = switchSizeButton(sizeButton);

    if (isLoading) {
        disabled = true;
    }

    return (
        <Button
            borderRadius={borderRadius}
            alignIcons={alignIcon}
            padding={padding}
            backgroundColor={backgroundColor}
            disabled={disabled}
            transparent={transparent}
            isLoading={isLoading}
            widthButton={widthButton}
            fullWidth={fullWidth}
            {...props}
        >
            {!isLoading ? iconButton : null}
            {isLoading ? (
                <ActivityIndicator size="small" color={textColor} />
            ) : (
                <TextButton fontSize={fontSize} textColor={textColor}>
                    {children}
                </TextButton>
            )}
        </Button>
    );
};
