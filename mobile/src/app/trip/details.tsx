import { useEffect, useState } from "react";
import { View, Text, Alert, FlatList } from "react-native";
import { Plus } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { validateInput } from "@/utils/validateInput";

import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import { TripLink, TripLinkProps } from "@/components/tripLink";
import { Participant, ParticipantProps } from "@/components/participant";

import { linksServer } from "@/server/links-server";
import { participantsServer } from "@/server/participants-server";

enum MODAL {
    NONE = 0,
    ADD_LINK = 1,
}

export function Details({ tripId }: { tripId: string }) {
    // MODAL
    const [showModal, setShowModal] = useState(MODAL.NONE)

    // LOADING
    const [isCreatingLink, setIsCreatingLink] = useState(false)

    // LISTS
    const [linksList, setLinksList] = useState<TripLinkProps[]>([])
    const [participants, setParticipants] = useState<ParticipantProps[]>([])

    // DATA
    const [linkTitle, setLinkTitle] = useState("")
    const [link, setLink] = useState("")

    function resetLinkFields() {
        setLinkTitle("")
        setLink("")
        setShowModal(MODAL.NONE)
    }

    async function handleCreateLinkTrip() {
        try {
            if (!validateInput.url(link.trim())) {
                return Alert.alert(
                    "Atenção!",
                    "Digite um link válido!",
                )
            }

            if (!linkTitle.trim()) {
                return Alert.alert(
                    "Link", 
                    "Informe o nome do link!",
                )
            }

            setIsCreatingLink(true)

            await linksServer.create({
                tripId, 
                title: linkTitle.trim(),
                url: link.trim(),
            })

            Alert.alert(
                "Link", 
                "O link foi cadastrado com sucesso!",
                [{ text: "OK!", onPress: () => { 
                    getTripLinks() 
                    resetLinkFields() 
                }}]
            )
        } catch (error) {
            console.log(error)
        } finally {
            setIsCreatingLink(false)
        }
    }

    async function getTripLinks() {
        try {
            const links = await linksServer.getLinksByTripId(tripId)
            setLinksList(links)
        } catch (error) {
            console.log(error)
        }
    }

    async function getTripParticipants() {
        try {
            const participants = await participantsServer.getByTripId(tripId)
            setParticipants(participants)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTripLinks()
        getTripParticipants()
    }, [])

    return (
        <View className="flex-1 mt-6">
            <Text className="text-zinc-50 text-2xl font-semibold mb-2">Links Importantes</Text>

            <View className="flex-1">
                {linksList.length === 0 ? (
                    <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
                        Nenhum link cadastrado.
                    </Text>
                ) : (
                    <FlatList 
                        data={linksList}
                        keyExtractor={(item) => item.id} 
                        renderItem={({ item }) => {
                            return (
                                <TripLink 
                                    data={item}
                                />
                            )
                        }}
                        contentContainerClassName="gap-4"
                    />
                )}

                <Button variant="secondary" onPress={() => setShowModal(MODAL.ADD_LINK)}>
                    <Plus color={colors.zinc[200]} size={20} />
                    <Button.Title>Novo Link</Button.Title>
                </Button>
            </View>

            <View className="flex-1 border-t border-zinc-800 mt-6">
                <Text className="text-zinc-50 text-2xl font-semibold my-6">Convidados</Text>

                <FlatList 
                    data={participants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Participant data={item} />}
                    contentContainerClassName="gap-4 pb-44"
                />
            </View>

            <Modal 
                title="Cadastrar Novo Link" 
                subtitle="Todos os convidados podem visualizar os links importantes"
                visible={showModal === MODAL.ADD_LINK}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-2 mb-4">
                    <Input variant="secondary">
                        <Input.Field 
                            placeholder="Titulo do Link" 
                            onChangeText={setLinkTitle}
                        />
                    </Input>

                    <Input variant="secondary">
                        <Input.Field 
                            placeholder="URL" 
                            onChangeText={setLink}
                            inputMode="url"
                        />
                    </Input>
                </View>

                <Button isLoading={isCreatingLink} onPress={handleCreateLinkTrip}>
                    <Button.Title>Cadastrar</Button.Title>
                </Button>
            </Modal>
        </View>
    )
}